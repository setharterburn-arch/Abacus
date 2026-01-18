"""
Addition Tutorial - Manim Animation
Teaches basic addition (2 + 3 = 5) using visual objects
"""

from manim import *

class AdditionTutorial(Scene):
    def construct(self):
        # Title
        title = Text("What is 2 + 3?", font_size=60, color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))
        
        # Show the problem
        problem = MathTex("2", "+", "3", "=", "?", font_size=72)
        self.play(Write(problem))
        self.wait(1)
        self.play(problem.animate.shift(UP * 1.5))
        
        # Create visual representation - apples
        apples_group1 = VGroup(*[
            Circle(radius=0.4, color=RED, fill_opacity=0.8).shift(LEFT * (1 - i * 0.9))
            for i in range(2)
        ])
        
        apples_group2 = VGroup(*[
            Circle(radius=0.4, color=RED, fill_opacity=0.8).shift(RIGHT * (1 + i * 0.9))
            for i in range(3)
        ])
        
        # Add apple stems
        for apple in apples_group1:
            stem = Line(apple.get_top(), apple.get_top() + UP * 0.2, color=DARK_BROWN, stroke_width=3)
            apple.add(stem)
            
        for apple in apples_group2:
            stem = Line(apple.get_top(), apple.get_top() + UP * 0.2, color=DARK_BROWN, stroke_width=3)
            apple.add(stem)
        
        # Show first group
        label1 = Text("2 apples", font_size=24, color=WHITE).next_to(apples_group1, DOWN)
        self.play(FadeIn(apples_group1), Write(label1))
        self.wait(1)
        
        # Show plus sign
        plus_sign = Text("+", font_size=48, color=YELLOW).move_to(ORIGIN)
        self.play(Write(plus_sign))
        self.wait(0.5)
        
        # Show second group
        label2 = Text("3 apples", font_size=24, color=WHITE).next_to(apples_group2, DOWN)
        self.play(FadeIn(apples_group2), Write(label2))
        self.wait(1)
        
        # Combine groups
        self.play(FadeOut(plus_sign), FadeOut(label1), FadeOut(label2))
        all_apples = VGroup(apples_group1, apples_group2)
        self.play(all_apples.animate.arrange(RIGHT, buff=0.5).move_to(ORIGIN))
        self.wait(1)
        
        # Count all apples
        count_label = Text("Let's count them all!", font_size=32, color=YELLOW)
        count_label.to_edge(DOWN)
        self.play(Write(count_label))
        
        # Highlight each apple while counting
        for i, apple in enumerate(all_apples):
            number = Text(str(i + 1), font_size=36, color=YELLOW)
            number.next_to(apple, UP, buff=0.2)
            self.play(
                apple.animate.scale(1.2),
                Write(number),
                run_time=0.5
            )
            self.play(apple.animate.scale(1/1.2), run_time=0.3)
            if i < len(all_apples) - 1:
                self.play(FadeOut(number), run_time=0.2)
            else:
                final_count = number
        
        self.wait(1)
        
        # Show answer
        answer = MathTex("2", "+", "3", "=", "5", font_size=72, color=GREEN)
        answer.shift(UP * 1.5)
        self.play(
            Transform(problem, answer),
            FadeOut(count_label),
            FadeOut(final_count)
        )
        
        # Celebration
        celebration = Text("Great job! 🎉", font_size=48, color=YELLOW)
        celebration.to_edge(DOWN)
        self.play(Write(celebration))
        
        # Final emphasis
        self.play(
            all_apples.animate.scale(1.1),
            rate_func=there_and_back,
            run_time=0.5
        )
        
        self.wait(2)

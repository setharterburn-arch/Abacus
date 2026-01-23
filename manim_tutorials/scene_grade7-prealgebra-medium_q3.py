from manim import *

class Grade7PrealgebraMedium3(Scene):
    def construct(self):
        equation = MathTex(
            "(5 + 3)^2 - 2 \times 7 &= 8^2 - 2 \times 7 \\",
            "&= 64 - 2 \times 7 \\",
            "&= 64 - 14 \\",
            "&= 50"
        )

        self.play(Write(equation[0]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[0].copy(), equation[1]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[1].copy(), equation[2]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[2].copy(), equation[3]))
        self.wait(2)
